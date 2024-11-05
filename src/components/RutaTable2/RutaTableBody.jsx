/* eslint-disable react/prop-types */
import { TableBody, TableRow, TableCell } from "@nextui-org/react";
import CellActions from './CellActions';

const RutaTableBody = ({ items, renderCell, onDetailClick, onEditClick, onDeleteClick }) => (
  <TableBody items={items}>
    {(item) => (
      <TableRow key={item.kode}>
        {(columnKey) => (
          <TableCell>
            {columnKey === 'aksi' ? (
              <CellActions
                onDetailClick={() => onDetailClick(item)}
                onEditClick={() => onEditClick(item)}
                onDeleteClick={() => onDeleteClick(item)}
              />
            ) : (
              renderCell(item, columnKey)
            )}
          </TableCell>
        )}
      </TableRow>
    )}
  </TableBody>
);

export default RutaTableBody;
