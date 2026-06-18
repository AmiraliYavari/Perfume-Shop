export default function ScentPyramid({ top, middle, base }) {
  const notes = [
    { label: 'نت آغازین', items: top, bg: 'bg-yellow-100 text-yellow-800' },
    { label: 'نت میانی', items: middle, bg: 'bg-pink-100 text-pink-800' },
    { label: 'نت پایانی', items: base, bg: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <div className="space-y-4">
      {notes.map((level) => (
        <div key={level.label}>
          <h4 className="font-semibold text-gray-600 mb-1">{level.label}</h4>
          <div className="flex flex-wrap gap-2">
            {(level.items || []).map((note) => (
              <span key={note} className={`px-2 py-1 rounded-full text-xs font-medium ${level.bg}`}>
                {note}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}