import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import type {Ad} from "@/entities/ad/model/types.ts";
import axios from "axios";
import module from './AddPage.module.scss'
import ImgCarousel from "@/shared/ui/ImgCarousel/ImgCarousel.tsx";
import arrow from "@/app/assets/icons/arrow.svg"
import {
    getTimeDifference,
    normalizeDateForModer,
    normalizeDescription,
    normalizeModel,
    normalizeStatus
} from "@/entities/ad/lib/formatters.ts";

const AddPage = () => {
    const {id} = useParams<{id: string}>();
    const location = useLocation();
    const navigate = useNavigate();
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [openComment, setOpenComment] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [otherOption, setOtherOption] = useState<string>('');
    const[error, setError] = useState<boolean>(false);
    const[whatButton, setWhatButton] = useState<number>(0);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3001/api/v1/ads/${id}`);
                const serverData = response.data;
                const transformedAd: Ad = {
                    ...serverData,
                    characteristics: {
                        guarantee: serverData.characteristics?.['Гарантия'],
                        model: serverData.characteristics?.['Модель'],
                        manufacturer: serverData.characteristics?.['Производитель'],
                        state: serverData.characteristics?.['Состояние'],
                        color: serverData.characteristics?.['Цвет']
                    }
                };
                setAd(transformedAd);
            } catch (error) {
                console.error('Error fetching ad:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAd().catch(error => console.error(error));
        }
    }, [id]);

    const handleNavigation = (direction: 'prev' | 'next') => {
        const ids = location.state?.ids as number[] | undefined;
        if (!ids || !Array.isArray(ids) || !id) return;

        const currentIdNum = parseInt(id, 10);
        const currentIndex = ids.findIndex((itemId: number) => itemId === currentIdNum);
        if (currentIndex === -1) return;

        let newIndex: number;
        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? ids.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === ids.length - 1 ? 0 : currentIndex + 1;
        }

        navigate(`/ads/${ids[newIndex]}`, {
            state: {
                ids,
                ...location.state
            }
        });
    };

    const handleClickPrev = () => handleNavigation('prev');
    const handleClickNext = () => handleNavigation('next');

    if (loading) return <div>Загрузка...</div>;
    if (!ad) return <div>Объявление не найдено</div>;

    const newDescription:string = normalizeDescription(ad.description);
    const newModel = normalizeModel(ad.characteristics?.model || '');
    const newDate = getTimeDifference(ad.seller?.registeredAt || '');
    const rate = ad.seller?.rating;
    const newRate = Number(rate || 0);



    const approveButton = async () =>{
        try {
            const response = await axios.post(`http://localhost:3001/api/v1/ads/${id}/approve`);
            console.log(response);
            navigate(`/`);
        }catch(error){
            console.error('Error fetching ad:', error);
        }
    }
    const rejectButton = () =>{
        setOpenComment(true);
        setWhatButton(1);
    }
    const workingButton = async () =>{
        setOpenComment(true);
        setWhatButton(2);
    }

    const rejectAdSelect = async (type:string) =>{
        try {
            return await axios.post(`http://localhost:3001/api/v1/ads/${id}/${type}`, {
                reason: selectedOption,
                comment: otherOption,
            });
        }catch(error){
            console.error('Error fetching ad:', error);
            throw error;
        }
    }

    const sendRejectForm = () =>{
        if(selectedOption.length === 0){
            setError(true);
            return;
        }
        if(whatButton === 1){
            rejectAdSelect("reject").catch((e) => console.error(e));
            console.log(rejectAdSelect("reject").catch((e) => console.error(e)))
        }else if(whatButton === 2){
            rejectAdSelect("request-changes").catch((e) => console.error(e));
            console.log(rejectAdSelect("request-changes").catch((e) => console.error(e)));
        }
        setSelectedOption('');
        setOpenComment(false);
        setWhatButton(0);
        navigate(`/`);
    }

    return (
        <div className={module.adCard}>
            <div className={module.adContainer}>
                <div className={module.imgDescriptionHistoryContainer}>
                    <div className={module.imgDescriptionContainer}>
                        <div className={module.imgContainer}>
                            <ImgCarousel altTextPrefix={'Product image'} imagesLinks={ad.images} width={480} height={315} arrowSize={60}/>
                        </div>
                        <div className={module.descriptionContainer}>
                            <h1 className={module.adTitle}>{ad.title}</h1>
                            <p>{newDescription}</p>
                        </div>
                    </div>
                </div>
                <div className={module.characteristicContainer}>
                    <div className={module.characteristic}>
                        <p>Характеристика</p>
                        <table className={module.characteristicTable}>
                            <tbody>
                            <tr>
                                <th>Цвет</th>
                                <td>{ad.characteristics?.color}</td>
                            </tr>
                            <tr>
                                <th>Гарантия</th>
                                <td>{ad.characteristics?.guarantee}</td>
                            </tr>
                            <tr>
                                <th>Производитель</th>
                                <td>{ad.characteristics?.manufacturer}</td>
                            </tr>
                            <tr>
                                <th>Модель</th>
                                <td>{newModel}</td>
                            </tr>
                            <tr>
                                <th>Состояние</th>
                                <td>{ad.characteristics?.state}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={module.aboutSeller}>
                        <p>Продавец</p>
                        <div className={module.spansAboutSeller}>
                            <span>Продавец </span><span>-</span><span className={module.sellerName}>{ad.seller?.name}</span><span>|</span>
                            <span className={newRate < 3.5 ? module.redRate : module.greenRate}>
                              {ad.seller?.rating}
                            </span>
                        </div>
                        <div className={module.spansAboutSeller}>
                            <span>{`${ad.seller?.totalAds} объявлений`}</span><span>|</span><span>На сайте:</span><span>{newDate}</span>
                        </div>
                    </div>
                    <div className={module.historyOfModeration}>
                        <p>История модерации</p>
                        <ol className={module.historyOfModerationContainer}>
                            {ad.moderationHistory.length > 0 ? ad.moderationHistory.map((action) => {
                                return (
                                    <li key={action.id} className={module.moderatedItem}>
                                        <p className={module.moderatorName}>{`${action.moderatorName}`}</p>
                                        <p className={module.moderatorTime}>{normalizeDateForModer(action.timestamp)}</p>
                                        <p className={
                                            action.action === 'rejected' ? module.moderatorActionRejected :
                                                action.action === 'approved' ? module.moderatorActionApproved :
                                                    module.moderatorActionPending
                                        }>{normalizeStatus(action.action)}</p>
                                    </li>
                                );
                            }) : <p>Пусто</p>}
                        </ol>
                    </div>
                </div>

                <div className={module.buttonsContainer}>
                    <button onClick={approveButton} className={module.buttonApprove}>Одобрить</button>
                    <button onClick={rejectButton} className={module.buttonReject}>Отклонить</button>
                    <button onClick={workingButton} className={module.buttonFinalize}>Доработка</button>
                </div>
                <div className={module.arrowsContainer}>
                    <button className={module.arrowLeft} onClick={handleClickPrev}>
                        <img src={arrow} alt="Предыдущее"/>
                    </button>
                    <button className={module.toMainPage} onClick={() => navigate('/')}>На главную</button>
                    <button className={module.arrowRight} onClick={handleClickNext}>
                        <img src={arrow} alt="Следующее"/>
                    </button>
                </div>
            </div>
            {openComment &&
                <div className={module.modaleCommentContainerBack} onClick={()=>setOpenComment(false)}>
                    <div className={module.modaleCommentContainer} onClick={(e) => e.stopPropagation()}>
                        <button className={module.closeButton} onClick={()=>setOpenComment(false)}>x</button>
                        <p className={module.modalTitle}>{whatButton === 2 ? 'Причина доработки' : 'Причина отклонения'}</p>
                        <form className={module.modalinputsContainer}>
                            <label>
                                <input
                                    type="radio"
                                    name="choice"
                                    value="Запрещённый товар"
                                    checked={selectedOption === 'Запрещённый товар'}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <span>Запрещённый товар</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="choice"
                                    value="Неверная категория"
                                    checked={selectedOption === 'Неверная категория'}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <span>Неверная категория</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="choice"
                                    value="Некорректное описание"
                                    checked={selectedOption === 'Некорректное описание'}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <span>Некорректное описание</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="choice"
                                    value="Проблемы с фото"
                                    checked={selectedOption === 'Проблемы с фото'}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <span>Проблемы с фото</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="choice"
                                    value="Подозрение на мошенничество"
                                    checked={selectedOption === 'Подозрение на мошенничество'}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <span>Подозрение на мошенничество</span>
                            </label>
                            <label>
                                <span className={module.otherCategories}>Другое</span>
                                <input
                                    value={otherOption}
                                    onChange={(e) => {setOtherOption(e.target.value)}}
                                    type="text"
                                />
                            </label>
                        </form>
                        {error && <span style={{color: 'red'}}>Выберите причину</span>}
                        <button onClick={sendRejectForm} className={whatButton === 1 ? module.sendRejectButton: module.sendfinalizeButton}>Отправить</button>
                    </div>
                </div>}
        </div>
    );
};

export default AddPage;