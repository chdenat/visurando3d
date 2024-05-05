import { SlDrawer }     from '@shoelace-style/shoelace/dist/react'
import './style.css'
import { ProfileUtils } from '@Utils/ProfileUtils'
import { forwardRef }   from 'react'
import { useSnapshot }  from 'valtio'
import { TrackUtils }   from '../../Utils/cesium/TrackUtils'
import { ProfileChart } from './ProfileChart'


export const Profile = forwardRef(function Profile(props, ref) {

    const mainStore = vt3d.mainProxy
    const mainSnap = useSnapshot(mainStore)

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
    const closeProfile = (event) => {
        if (isOK(event)) {
            mainStore.components.profile.show = false
        }
    }

    const data = ProfileUtils.prepareData()
    TrackUtils.setProfileVisibility(vt3d.theJourney)

    return (
        <>
            {mainSnap.canViewProfile &&
                <div id="profile-container" key={mainSnap.components.profile.key}>
                    <SlDrawer id="profile-pane" open={mainSnap.components.profile.show}
                              onSlRequestClose={handleRequestClose}
                              contained
                              onSlHide={closeProfile}
                              placement="bottom"
                    >
                        {data && <ProfileChart series={data.series}
                                               options={data.options}
                                               height={__.ui.css.getCSSVariable('--vt3d-profile-chart-height')}
                        />}
                    </SlDrawer>
                </div>
            }
        </>
    )
})
