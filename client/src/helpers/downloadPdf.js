import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { uploadPDF } from "./uploadPDF.js";

export const downloadPDF = async ({
  pdfRef,
  updateEvent,
  setFileUrl,
  fileUrl,
  showSuccess,
  isLoading,
  setIsLoading,
  event,
}) => {
  try {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);

    const pdfBlob = pdf.output("blob");

    await uploadPDF({
      event,
      pdfBlob,
      updateEvent,
      setFileUrl,
      fileUrl,
      showSuccess,
      isLoading,
      setIsLoading,
    });

    return true;
  } catch (error) {
    console.error("Fejl under PDF-generering:", error);
    return false;
  }
};
