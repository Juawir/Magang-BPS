/* eslint-disable react/prop-types */
import { TableHeader, TableColumn } from "@nextui-org/react";

const RutaTableHeader = ({ columns }) => (
  <TableHeader columns={columns} className="font-inter text-pdarkblue">
    {(column) => (
      <TableColumn
        key={column.uid}
        align={column.uid === 'aksi' ? 'center' : 'start'}
      >
        {column.name}
      </TableColumn>
    )}
  </TableHeader>
);

export default RutaTableHeader;
