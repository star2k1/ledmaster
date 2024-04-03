import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';

const useOrientation = () => {
    const pathname = usePathname();

    useEffect(() => {
        const changeOrientation = async () => {
            if (pathname === '/newdesign') {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } else {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            }
        };
        console.log(pathname);
        changeOrientation();

    }, [pathname]);

    return pathname;
};

export default useOrientation;