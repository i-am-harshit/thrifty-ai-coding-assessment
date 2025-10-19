import "./styles.scss";

export default function Card({ children, width, minWidth, ...rest }) {
  const style = {};
  if (width) style.width = width;
  if (minWidth) style.minWidth = minWidth;
  return (
    <div className="card-container" style={style} {...rest}>
      {children}
    </div>
  );
}
