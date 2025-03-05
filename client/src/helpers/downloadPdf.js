import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { uploadPDF } from "./uploadPDF.js";

export const downloadPDF = ({
  pdfRef,
  updateEvent,
  setFileUrl,
  fileUrl,
  showSuccess,
  isLoading,
  setIsLoading,
  event,
}) => {
  html2canvas(pdfRef.current, { scale: 2 })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);

      const pdfBlob = pdf.output("blob");
      uploadPDF({
        event,
        pdfBlob,
        updateEvent,
        setFileUrl,
        fileUrl,
        showSuccess,
        isLoading,
        setIsLoading,
      });
    })
    .catch((error) => {
      console.error("Fejl i html2canvas:", error);
    });
};
