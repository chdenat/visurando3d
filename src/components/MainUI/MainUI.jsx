import { CameraPositionUI }       from '@Components/cesium/CameraPositionUI/CameraPositionUI'
import { CompassUI }              from '@Components/cesium/CompassUI/CompassUI'
import { FullScreenButton }           from '@Components/FullScreenButton/FullScreenButton'
import { Toolbar }                from '@Components/MainUI/Toolbar'
import { Profile }                from '@Components/Profile/Profile'
import { TracksEditor }           from '@Components/TracksEditor/TracksEditor'
import { useEffect }              from 'react'
import { useCesium }              from 'resium'

import './style.css'
import { subscribe } from 'valtio'
import { CanvasEvents }           from '../../core/events/CanvasEvents.js'
import { CameraTargetPositionUI } from '../cesium/CameraPositionUI/CameraTargetPositionUI.jsx'
import { JourneyLoaderUI }        from '../FileLoader/JourneyLoaderUI'
import { FloatingMenu }           from '../FloatingMenu/FloatingMenu'
import { Panel }                  from '../InformationPanel/Panel'
import { PanelButton }            from '../InformationPanel/PanelButton'
import { Utils }                  from '../TracksEditor/Utils.js'
import { SupportUI } from './SupportUI'
import { SupportUIButton }        from './SupportUIButton'

export const MainUI = function VT3D_UI() {

    lgs.viewer = useCesium().viewer

    useEffect(() => {

        // Manage canvas related events
         CanvasEvents.attach()
        // CanvasEvents.addListeners()

    }, [])

    // We need to interact with  Editor
    subscribe(lgs.journeyEditorStore,() => {
        const offset = lgs.journeyEditorStore.show ? Utils.panelOffset() : 0
        __.ui.css.setCSSVariable('--top-right-ui-right-margin', offset)
    })

    return (
        <>
            <div id="lgs-main-ui">
                    <>
                <div id={'top-left-ui'}>
                    <CameraPositionUI/>
                    <CameraTargetPositionUI/>

                    <Toolbar editor={true}
                             profile={true}
                             fileLoader={true}
                             position={'vertical'}
                             tooltip={'right'}/>
                    <PanelButton/>
                    <SupportUIButton/>
                    <FullScreenButton/>
                </div>

                <div id={'bottom-ui'}>
                    {/* <div id={'bottom-left-ui'}></div> */}
                    <div id={'profile-ui'}>
                        <Profile/>
                    </div>
                    {/* <div id={'bottom-right-ui'}></div> */}
                </div>
                <div id={'top-right-ui'}>
                    <CompassUI scene={lgs.scene}/>
                </div>

                {/* <FloatingMenu/> */}
                    </>

            </div>
            <JourneyLoaderUI/>
            <Panel/>
            <SupportUI/>
            <TracksEditor/>
        </>
    )
}

