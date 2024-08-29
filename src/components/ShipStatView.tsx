import './ShipStatView.css';

function ShipStatView(props: {name: string, attack: number, stamina: number, speed: number, hit: number, activeRow: string}) {
    const { attack, stamina, speed, hit, name, activeRow } = props;
    const rowActiveOrNot = (row: string) => {
      if (row === activeRow) {
        return row + ' active-stat-row';
      } else {
        return row + ' inactive-stat-row';
      }
    };

    return (
        <div className="stat-board" data-testid="ship-stats">
            <div className="title-row"><b>{name}</b></div>
            <div data-testid="attack-row" className={rowActiveOrNot("attack-row")}>Attack: <b>{attack}</b></div>
            <div data-testid="stamina-row" className={rowActiveOrNot("stamina-row")}>Stamina: <b>{stamina}</b></div>
            <div data-testid="speed-row" className={rowActiveOrNot("speed-row")}>Speed: <b>{speed}</b></div>
            <div data-testid="hit-row" className={rowActiveOrNot("hit-row")}>Hit%: <b>{hit}</b></div>
        </div>
    )
};

export default ShipStatView;