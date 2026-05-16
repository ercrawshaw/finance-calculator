function Button({
    buttonType,
    clickedFunction,
    text,
}) {
    return (
        <button className={buttonType} onClick={clickedFunction}>
            {text}
        </button>
    )
};

export default Button;