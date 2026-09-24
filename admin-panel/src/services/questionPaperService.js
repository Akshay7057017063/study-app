
import api from "./api";

// Get all question papers with optional filters
export const getQuestionPapers = async (
  filters = {}
) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(key, value);
      }
    }
  );

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return await api(
    `/question-papers${query}`
  );
};

// Get question paper by ID
export const getQuestionPaperById = async (
  id
) => {
  return await api(
    `/question-papers/${id}`
  );
};

// Create question paper
export const createQuestionPaper = async (
  questionPaperData
) => {
  return await api("/question-papers", {
    method: "POST",
    body: JSON.stringify(
      questionPaperData
    ),
  });
};

// Update question paper
export const updateQuestionPaper = async (
  id,
  questionPaperData
) => {
  return await api(
    `/question-papers/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        questionPaperData
      ),
    }
  );
};

// Delete question paper
export const deleteQuestionPaper = async (
  id
) => {
  return await api(
    `/question-papers/${id}`,
    {
      method: "DELETE",
    }
  );
};

