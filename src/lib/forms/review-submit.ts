export type ResettableForm = { reset: () => void };

/** Success clears the form only when the element captured before `await` is still present. */
export function applyReviewSubmitResult(input: {
  ok: boolean;
  form: ResettableForm | null;
}): "success" | "error" {
  if (!input.ok) return "error";
  input.form?.reset();
  return "success";
}
