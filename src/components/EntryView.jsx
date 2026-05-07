export default function EntryView({ onEnter }) {
  return (
    <section className="entry-view">
      <button className="entry-box-button" type="button" onClick={onEnter}>
        <span className="entry-open-text">open</span>
      </button>
    </section>
  );
}