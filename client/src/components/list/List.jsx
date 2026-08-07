import "./list.scss";
import Card from "../card/Card";

function List({ posts, onDelete, onUpdate, isMyListing }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={item}
          onDelete={isMyListing ? () => onDelete(item.id) : null} // Show delete button only for My Listings
          onUpdate={isMyListing ? () => onUpdate(item.id) : null} // Show edit button only for My Listings
        />
      ))}
    </div>
  );
}

export default List;
