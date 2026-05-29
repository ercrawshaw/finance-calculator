function Button({
  buttonType,
  clickedFunction,
  text,
  type = 'button',
}) {
  return (
    <button className={buttonType} onClick={clickedFunction} type={type}>
      {text}
    </button>
  );
}

export default Button;