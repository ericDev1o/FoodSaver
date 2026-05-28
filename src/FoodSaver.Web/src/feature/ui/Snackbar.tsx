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
                className='cancel'
            >
                {message} - Undo
            </button>

            <button onClick={onConfirm}>
                Confirm
            </button>
        </div>
    );
}