export default function FormField({
  isVisible,
  setIsVisible,
  label,
  type,
  placeholder,
  id,
  register,
  errors,
  name,
  classname,
  disabled = false,
  defaultValue,
}) {
  // const fieldError = name
  //   ?.split(".")
  //   .reduce((acc, key) => acc?.[key], errors ?? {});
  // const registerProps = register ? register(name) : {};
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  return (
    <div className={classname}>
      <fieldset className="fieldset relative">
        <legend className="fieldset-legend">{label}</legend>
        <input
          type={isVisible ? "text" : type}
          placeholder={placeholder}
          className={`input input-lg w-full bg-white text-black ${
            errors?.[name] && "border-red-600"
          }`}
          id={id}
          {...register(name)}
          disabled={disabled}
          defaultValue={defaultValue}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 text-xs border-0 focus:outline-none font-semibold cursor-pointer text-black"
            onClick={toggleVisibility}
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        )}
      </fieldset>
      {errors?.[name]?.message && (
        <span className="text-xs text-red-600">{errors?.[name]?.message}</span>
      )}
    </div>
  );
}
