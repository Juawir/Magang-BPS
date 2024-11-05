/* eslint-disable react/prop-types */
import { Tooltip } from "@nextui-org/react";
import { Popconfirm } from 'antd';
import { DeleteIcon, EditIcon, EyeIcon } from "./Icons";

const CellActions = ({ onDetailClick, onEditClick, onDeleteClick }) => (
  <div className="relative flex items-center gap-2">
    <Tooltip content="Detail">
      <span className="text-lg cursor-pointer text-default-400 active:opacity-50" onClick={onDetailClick}>
        <EyeIcon />
      </span>
    </Tooltip>
    <Tooltip content="Edit">
      <span className="text-lg cursor-pointer text-default-400 active:opacity-50" onClick={onEditClick}>
        <EditIcon />
      </span>
    </Tooltip>
    <Tooltip color="danger" content="Hapus">
      <Popconfirm title="Hapus Rumah Tangga" description="Anda yakin menghapus Rumah tangga ini?" onConfirm={onDeleteClick}>
        <span className="text-lg cursor-pointer text-danger active:opacity-50">
          <DeleteIcon />
        </span>
      </Popconfirm>
    </Tooltip>
  </div>
);

export default CellActions;
