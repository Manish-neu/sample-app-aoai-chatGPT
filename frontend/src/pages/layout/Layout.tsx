import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Azure from "../../assets/Azure.svg";
import { CopyRegular, ShareRegular } from "@fluentui/react-icons";
import { CommandBarButton, Dialog, Stack, TextField, ICommandBarStyles, IButtonStyles, DefaultButton  } from "@fluentui/react";
import { useContext, useEffect, useState} from "react";
import { HistoryButton, ShareButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { Config, CosmosDBStatus } from "../../api";
import { getConfig } from "../../api";

const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
    root: {
      width: 86,
      height: 32,
      borderRadius: 4,
      background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)',
    //   position: 'absolute',
    //   right: 20,
      padding: '5px 12px',
      marginRight: '20px'
    },
    icon: {
      color: '#FFFFFF',
    },
    rootHovered: {
      background: 'linear-gradient(135deg, #0F6CBD 0%, #2D87C3 51.04%, #8DDDD8 100%)',
    },
    label: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
    },
  };

const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const appStateContext = useContext(AppStateContext)
    const [config, setConfig] = useState<Config>();

    const handleShareClick = () => {
        setIsSharePanelOpen(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    useEffect(() => {}, [appStateContext?.state.isCosmosDBAvailable.status]);
    useEffect(() => {
        const fetchConfig = async () => {
            const data = await getConfig();
            setConfig(data);
        }

        fetchConfig()
        .catch(console.error);

    }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between"
                // className={styles.headerContainer}
                >
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={config?.company_app_header_logo_url}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>{config?.app_header_title}</h1>
                        </Link>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 4 }}>
                            {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) && 
                                <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? "Hide chat history" : "Show chat history"}/>    
                            }
                            <ShareButton onClick={handleShareClick} />
                    </Stack>

                </Stack>
            </header>
            <Outlet />
            <Dialog 
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{
                    
                    main: [{
                        selectors: {
                          ['@media (min-width: 480px)']: {
                            maxWidth: '600px',
                            background: "#FFFFFF",
                            boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                            borderRadius: "8px",
                            maxHeight: '200px',
                            minHeight: '100px',
                          }
                        }
                      }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{gap: "8px"}}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly/>
                    <div 
                        className={styles.copyButtonContainer} 
                        role="button" 
                        tabIndex={0} 
                        aria-label="Copy" 
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
        </div>
    );
};

export default Layout;
