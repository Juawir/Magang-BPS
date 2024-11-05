/* eslint-disable react/prop-types */
import { Pagination } from "@nextui-org/react";

const RutaTableFooter = ({ page, totalPages, onPageChange }) => (
  <div className="flex justify-center w-full">
    <Pagination
      isCompact
      showControls
      showShadow
      color="secondary"
      page={page}
      total={totalPages}
      onChange={onPageChange}
    />
  </div>
);

export default RutaTableFooter;
