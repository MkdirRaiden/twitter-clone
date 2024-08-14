import { LiaArrowRightSolid, LiaArrowLeftSolid } from "react-icons/lia";

const Pagination = ({ pageNo, setPageNo, page, isPlaceholderData }) => {
  return (
    <div>
      {" "}
      {page?.totalPages != 0 && (
        <div className="join py-6">
          <div className="join gap-1">
            {pageNo != 1 && (
              <button
                disabled={pageNo === 1}
                onClick={() => {
                  setPageNo((old) => Math.max(old - 1, 1));
                }}
                className={` btn rounded-full w-12 h-12}`}
              >
                <LiaArrowLeftSolid />
              </button>
            )}

            {page?.totalPages > 1 &&
              Array.from({ length: page.totalPages }).map((_, index) => {
                return (
                  <button
                    disabled={isPlaceholderData || pageNo === index + 1}
                    onClick={() => {
                      setPageNo(index + 1);
                    }}
                    key={index}
                    className={`rounded-full w-12 h-12 ${
                      index + 1 == pageNo ? "pagination-btn-active" : "btn"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            {page?.users && pageNo != page?.totalPages && (
              <button
                disabled={pageNo === page?.totalPages}
                onClick={() => {
                  setPageNo((old) => Math.min(old + 1, page.totalPages));
                }}
                className={` btn rounded-full w-12 h-12 }`}
              >
                <LiaArrowRightSolid />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
