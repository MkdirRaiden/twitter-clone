import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useFollow = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { mutate: followUnFollow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await axios.post(`/api/users/follow/${userId}`);
        const data = res.data;
        if (data.error) return toast.error(data.error);
        toast.success(data.message);
      } catch (error) {
        toast.error(error.response.data.error);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({
          queryKey: ["userProfile", authUser.username],
        }),
        queryClient.invalidateQueries({
          queryKey: ["posts", authUser.username],
        }),
      ]);
    },
  });
  return [followUnFollow, isPending];
};

export const useGetData = ({ qKey, url }) => {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      try {
        const res = await axios.get(url);
        const data = res.data;
        if (data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        return null;
      }
    },
  });
  return { data, isLoading, refetch, isRefetching };
};

export const usePost = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ method, url, data = null, qKey = [], callbackFn }) => {
      try {
        const res = await getResData(method, url, data);
        if (res.data.error) return toast.error(res.data.error);
        if (qKey.length != 0) {
          queryClient.invalidateQueries({ queryKey: qKey });
        }
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        callbackFn();
        if (res.data.message) return toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.error || "Something went wrong!");
      }
    },
  });

  return { mutate, isPending };
};

const getResData = async (method, url, data) => {
  switch (method) {
    case "post":
      return data ? await axios.post(url, data) : await axios.post(url);
    case "put":
      return data ? await axios.put(url, data) : await axios.put(url);
    case "delete":
      return data ? await axios.delete(url, data) : await axios.delete(url);
    default:
      return data ? await axios.post(url, data) : await axios.post(url);
  }
};

export const getUsersPage = async ({ url }) => {
  try {
    const res = await axios.get(url);
    const data = res.data;
    if (data.error) throw new Error(data.error);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    return;
  }
};
