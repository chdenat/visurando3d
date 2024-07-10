import { SlDrawer }        from '@shoelace-style/shoelace/dist/react'
import './style.css'
import { forwardRef }      from 'react'
import { useSnapshot }     from 'valtio'
import { Toolbar }         from '../MainUI/Toolbar'
import { JourneySelector } from './journey/JourneySelector'
import { JourneySettings } from './journey/JourneySettings'
import { TrackSelector }   from './track/TrackSelector'
import { TrackSettings }   from './track/TrackSettings'
import { Utils }           from './Utils'

//read version


export const TracksEditor = forwardRef(function TracksEditor(props, ref) {

    const mainStore = lgs.mainProxy
    const mainSnap = useSnapshot(mainStore)

    const editorStore = lgs.theJourneyEditorProxy
    const editorSnapshot = useSnapshot(editorStore)

    /**
     * Avoid click outside drawer
     */
    const handleRequestClose = (event) => {
        if (event.detail.source === 'overlay') {
            event.preventDefault()
        }
    }
    /**
     * Close tracks editor pane
     *
     * @param event
     */
    const closeTracksEditor = (event) => {
        if (window.isOK(event)) {
            lgs.journeyEditorStore.show = false
        }
    }

    return (<>
        <div id="journeys-editor-container" key={mainSnap.components.journeyEditor.key}>
            {mainSnap.canViewJourneyData &&
                <SlDrawer id="journeys-editor-pane"
                          open={mainSnap.components.journeyEditor.show}
                          onSlRequestClose={handleRequestClose}
                          contained
                          onSlHide={closeTracksEditor}
                >
                    <div slot="header-actions">
                        <Toolbar editor={false}
                                 profile={true}
                                 fileLoader={true}
                                 position={'horizontal'}
                                 tooltip={'top'}
                                 mode={'embed'}
                        />
                    </div>
                    {lgs.journeys.size > 0 && <div id={'track-settings-container'}>
                        <JourneySelector onChange={Utils.initJourneyEdition}
                                         label={'Select a Journey:'}
                                         single={true}/>
                        <JourneySettings/>

                        {editorSnapshot.journey.visible && <>
                            <TrackSelector onChange={Utils.initTrackEdition}
                                           label={'Select one of the tracks:'}/>
                            <TrackSettings/>
                        </>}
                    </div>}
                    <div id="journeys-editor-footer" slot={'footer'}></div>
                </SlDrawer>}
        </div>
    </>)
})
