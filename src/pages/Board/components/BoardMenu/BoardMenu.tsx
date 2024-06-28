import { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faChevronLeft, faXmark, faPalette, faMinus } from '@fortawesome/free-solid-svg-icons';
import { images } from '../../../../assets/images';
import { colors } from '../../../../assets/colors';
import './BoardMenu.scss';
import { BoardMenuProps } from '../../../../common/types/props';

export function BoardMenu({ deleteBoard, changeBackground }: BoardMenuProps): ReactElement {
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenuPage, setActiveMenuPage] = useState<string>('main');

  const menuPages: Record<string, Record<string, string>> = {
    main: {
      title: 'Меню',
    },
    changingBg: {
      title: 'Змінити фон',
    },
  };

  return (
    <>
      {!showMenu && (
        <button className="show-board-menu_btn head-btn" onClick={() => setShowMenu(true)}>
          {' '}
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      )}
      {showMenu && (
        <div className={`board-menu ${activeMenuPage === 'changingBg' ? 'changing-bg' : ''}`}>
          <div className="menu-head">
            {activeMenuPage !== 'main' && (
              <button className="return-btn" onClick={() => setActiveMenuPage('main')}>
                {' '}
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            )}
            <h2>{menuPages[activeMenuPage].title}</h2>
            <button
              className="close-btn"
              onClick={() => {
                setShowMenu(false);
                setActiveMenuPage('main');
              }}
            >
              {' '}
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <hr />
          {activeMenuPage === 'main' && (
            <div className="main_page">
              <button className="change-board-bg_btn" onClick={() => setActiveMenuPage('changingBg')}>
                <FontAwesomeIcon className="icon" icon={faPalette} />
                Змінити фон
              </button>
              <button className="delete-board_btn" onClick={deleteBoard}>
                <FontAwesomeIcon className="icon" icon={faMinus} />
                Видалити дошку
              </button>
            </div>
          )}
          {activeMenuPage === 'changingBg' && (
            <div className="changing-bg_page">
              <p>Кольори</p>
              <div className="bg_container colors_container">
                {colors.map((i) => (
                  <button
                    key={`${i}-color`}
                    className="bg_btn color_btn"
                    style={{ backgroundColor: i }}
                    onClick={() => changeBackground(i)}
                  >
                    {' '}
                  </button>
                ))}
              </div>
              <hr />
              <p>Зображення</p>
              <div className="bg_container images_container">
                {images.map((i) => (
                  <button
                    key={`image-${i.id}`}
                    className="bg_btn image_btn"
                    style={{ background: `url(${i.img}) top/cover` }}
                    onClick={() => changeBackground(`url(${i.img}) top/cover`)}
                  >
                    {' '}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
