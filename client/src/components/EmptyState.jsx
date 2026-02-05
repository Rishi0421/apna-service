const EmptyState = ({ title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{description}</p>

      {actionText && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
