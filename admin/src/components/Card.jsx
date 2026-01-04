const Card = ({ title, count }) => (
  <div className="bg-white shadow rounded p-6 flex flex-col items-center justify-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{count}</p>
  </div>
);

export default Card;
