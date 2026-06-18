export default function SectionTitle({ title }) {
  return (
    <div className="text-center my-12">
      <h2 className="text-3xl font-bold text-gray-800 inline-block relative">
        {title}
        <span className="block h-1 w-20 bg-amber-500 mx-auto mt-2 rounded"></span>
      </h2>
    </div>
  );
}