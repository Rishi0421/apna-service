const ProviderEmptyState = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ProviderEmptyState;
