import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { apiUrl } from "../apiUrl";

const useFetchFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  // HENT ALLE AKTIVITETER – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchFaqs = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/faqs`);
      const data = await response.json();
      setFaqs(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching faqs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchFaqs
  const refetch = useCallback(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const createFaq = async (faqData) => {
    try {
      const response = await fetch(`${apiUrl}/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(faqData),
      });

      if (!response.ok) {
        throw new Error("Fejl ved oprettelse af faq");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // OPDATER FAQ
  const updateFaq = async (faqData) => {
    try {
      const response = await fetch(`${apiUrl}/faq`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(faqData),
      });

      if (!response.ok) {
        throw new Error("Fejl ved opdatering af faq");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // SLET FAQ
  const deleteFaq = async (params) => {
    await fetch(`${apiUrl}/faq/${params}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /* Filter all the faqs without the matching ID. */
    const filteredArray = faqs.filter((act) => act._id !== params);

    setFaqs(filteredArray);
  };

  // HENT FAQ BASERET PÅ ID
  const fetchFaqById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/faq/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch faq: ${errorText}`);
      }

      const faq = await response.json();
      return faq.data;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching faq:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return {
    faqs,
    createFaq,
    deleteFaq,
    setFaqs,
    fetchFaqs,
    fetchFaqById,
    updateFaq,
    isLoading,
    refetch,
    error,
  };
};

export { useFetchFaqs };
