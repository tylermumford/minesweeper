import Square from "./square"
import styles from "./game-board.module.css"
import Position from "@/position"


export default function GameBoard() {
    let positions = Position.All();
    let squares = positions.map(p => <Square position={p} />);
    return <div className={styles.game_board}>
        {squares}
    </div>
}