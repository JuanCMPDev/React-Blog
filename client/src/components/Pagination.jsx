const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
  displayRange = 3,
  prevLabel = "<",
  nextLabel = ">",
  category = null
}) => {
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Botón de flecha hacia atrás
    if (currentPage > 1) {
      buttons.push(
        <button key="prev" className="pagination-btn" onClick={() => onChangePage(currentPage - 1)}>
          {prevLabel}
        </button>
      );
    }
    
    // Cálculo del rango de páginas a mostrar
    let startPage = currentPage >= 2 ? currentPage : Math.max(1, currentPage - Math.floor(displayRange / 2));
    let endPage = Math.min(totalPages, startPage + displayRange - 1);
    
    // Ajuste para asegurar que siempre se muestren displayRange páginas
    if (endPage - startPage + 1 < displayRange) {
      endPage = Math.min(totalPages, startPage + displayRange - 1);
      startPage = Math.max(1, endPage - displayRange + 1);
    }
    
    // Botones de página
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onChangePage(i)}
          className={`pagination-btn ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }
    
    // Botón de flecha hacia adelante
    if (currentPage < totalPages) {
      buttons.push(
        <button key="next" className="pagination-btn" onClick={() => onChangePage(currentPage + 1)}>
          {nextLabel}
        </button>
      );
    }
    
    return buttons;
  };
  
  if (!category) {
    return <div className="pagination">{renderPaginationButtons()}</div>;
  }
  
  return null;
};

export default Pagination;
