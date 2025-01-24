interface FormFieldProps {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}