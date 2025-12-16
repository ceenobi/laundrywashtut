export default function SelectField({
  label,
  id,
  register,
  name,
  placeholder,
  data,
  errors,
  disabled = false,
}) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <select
        defaultValue={""}
        className="select select-lg bg-white text-black capitalize w-full"
        id={id}
        name={name}
        {...register(name)}
        disabled={disabled}
      >
        <option value="" disabled={true} className="">
          {placeholder}
        </option>
        {data?.map((option, index) => (
          <option key={index} value={option.id || option}>
            {option.name || option}
          </option>
        ))}
      </select>
      {errors?.[name]?.message && (
        <span className="text-xs text-red-600">{errors?.[name]?.message}</span>
      )}
    </fieldset>
  );
}
