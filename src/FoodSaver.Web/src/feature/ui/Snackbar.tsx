import './Snackbar.css';

type Props = {
  message: string;
  onUndo: () => void;
  onConfirm: () => void;
};

export function Snackbar({
     message,
     onUndo,
     onConfirm
}: Props) {
    return (
        <div>
            <button
                onClick={onUndo}
                aria-label='Undo last action'
                className='cancel'
            >
                {message} - Undo
            </button>

            <button
                onClick={onConfirm}
                aria-label='Close undo button'
            >
                Confirm
            </button>
        </div>
    );
}