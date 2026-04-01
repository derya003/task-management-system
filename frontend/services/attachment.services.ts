import api from "@/lib/axios";

export const uploadAttachment = async (taskId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getAttachmentsByTask = async (taskId: number) => {
  const { data } = await api.get(`/tasks/${taskId}/attachments`);
  return data;
};

export const deleteAttachment = async (attachmentId: number) => {
  const { data } = await api.delete(`/tasks/attachments/${attachmentId}`);
  return data;
};

export const downloadAttachment = (attachmentId: number) => {
  window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/attachments/${attachmentId}/download`,
    "_blank"
  );
};
