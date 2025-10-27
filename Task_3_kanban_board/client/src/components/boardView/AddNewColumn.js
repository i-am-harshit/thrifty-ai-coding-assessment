import "./styles.scss";

export default function AddNewColumn({ onAddColumn }) {
  return (
    <div className="add-column-container" onClick={onAddColumn}>
      <p className="add-column-title">+ New Column</p>
    </div>
  );
}
