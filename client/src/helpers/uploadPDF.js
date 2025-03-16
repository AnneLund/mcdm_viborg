import { apiUrl } from "../apiUrl";

export const uploadPDF = async ({
  pdfBlob,
  updateEvent,
  setFileUrl,
  fileUrl,
  showSuccess,
  setIsLoading,
  event,
}) => {
  const formData = new FormData();
  formData.append("file", pdfBlob, "exam.pdf");

  try {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.fileUrl) {
      setFileUrl(data.fileUrl);
      const formData = new FormData();
      formData.append("file", fileUrl);

      await updateEvent(event._id, { file: data.fileUrl });
    } else {
      console.error("Fejl: Ingen fileUrl modtaget");
    }
  } catch (error) {
    console.error("Fejl ved upload:", error);
  } finally {
    showSuccess("Gemt!", "PDF blev gemt med succes");
    setIsLoading(false);
  }
};
