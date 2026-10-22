'use client';

export default function CancelButton() {
  return (
    <button 
      type="submit"
      className="text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-100"
      onClick={(e) => {
        if (!window.confirm('Apakah Anda yakin ingin membatalkan janji temu ini?')) {
          e.preventDefault();
        }
      }}
    >
      Batalkan Janji
    </button>
  );
}