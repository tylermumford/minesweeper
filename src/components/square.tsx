import styles from './square.module.css';
import Position from '@/position';

export default function Square({ position }: { position: Position}) {
    let label = position.row + position.col.toString();
    return <p className={ styles.square }>{label}</p>
}