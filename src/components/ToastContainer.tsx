import { useState, useEffect } from 'react';
import Toast from './Toast';
import { CToastItem, CToastContainerProps } from './Toasts';

function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

const defaultToasts = {
  topLeft: [],
  topCenter: [],
  topRight: [],
  bottomLeft: [],
  bottomCenter: [],
  bottomRight: [],
};

function ToastContainer({ toast, hiddenID, theme, icons }: CToastContainerProps) {
  const [allToasts, setToasts] = useState(defaultToasts);
  useEffect(() => {
    if (toast) {
      setToasts((prevToasts) => {
        const position = camelCase(toast.position || 'top-center');
        return { ...prevToasts, [position]: [...prevToasts[position], toast] };
      });
    }
  }, [toast]);

  const handleRemove = (callback) => {
    return (id: number, position: string): void => {
      setToasts((prevToasts) => {
        const toastPosition = camelCase(position || 'top-center');
        return {
          ...prevToasts,
          [toastPosition]: prevToasts[toastPosition].filter(
            (item: CToastItem) => item.id !== id,
          ),
        };
      });
      if (typeof callback === 'function') callback(id, position);
    };
  };

  const rows = ['top', 'bottom'];
  const groups = ['Left', 'Center', 'Right'];
  return (
    <>
      {rows.map((row) => (
        <div key={`row_${row}`} className={`ct-row ct-row-${row.toLocaleLowerCase()}`}>
          {groups.map((group) => {
            const type = `${row}${group}`;
            const className = [
              'ct-group',
              row === 'bottom' ? 'ct-flex-bottom' : '',
            ].join(' ');
            return (
              <div key={type} className={className}>
                {allToasts[type].map((item: CToastItem) => (
                  <Toast
                    key={`${type}_${item.id}`}
                    {...item}
                    id={item.id}
                    text={item.text}
                    type={item.type}
                    onClick={item.onClick}
                    hideAfter={item.hideAfter}
                    show={hiddenID !== item.id}
                    onHide={handleRemove(item.onHide)}
                    theme={theme}
                    icons={icons}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

export default ToastContainer;
