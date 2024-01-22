const THUMBNAILS = [...Array(6).keys()].map((i) => {
  // TODO: add styles
  return (
    <div key={i} className="h-60 flex flex-col items-center">
      <div className="bg-gray-700 h-2/3 mb-4 w-3/4"></div>
      <div className="bg-gray-600 h-8 animate-pulse w-3/4"></div>
    </div>
  );
});

export function LoadingThumbnail() {
  return <>{THUMBNAILS}</>;
}
