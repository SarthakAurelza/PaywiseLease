// components/PaginationControls.jsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1, e);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1, e);
  };

  return (
    <Pagination className="w-full pt-8">
      <PaginationContent className="w-full flex justify-between">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
