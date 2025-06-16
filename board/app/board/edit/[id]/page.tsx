"use client";

import { useBoardEdit } from "../../../hook/boardEdit";
import BoardForm from "../../components/board-form";

export default function EditPostPage() {
  const { control, handleSubmit, onSubmit, errors, loading, defaultThumbnail } = useBoardEdit();

  return (
    <BoardForm
      control={control}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      mode="edit"
      defaultThumbnail={defaultThumbnail}
    />
  );
}
