import React from 'react'
import { ArrowRight } from 'lucide-react'
import {
    isCampaignLive,
    deadlineLabel,
    openForm,
    TRACE_PATH,
} from '../lib/joinCampaign'
import './JoinCampaignBanner.css'

/* Inline banner for the Join Us page. Unlike the Home popup this is
 * page content: not dismissible, always visible while the campaign
 * runs, and gone the moment CAMPAIGN_END passes. */
const JoinCampaignBanner = () => {
    if (!isCampaignLive()) return null

    return (
        <section className="join-banner" aria-labelledby="join-banner-title">
            <div className="join-banner__text">
                <p className="join-banner__tag">/// Applications Open</p>

                <h2 className="join-banner__title" id="join-banner-title">
                    Apply to the <span>Nirma branch</span>
                </h2>

                <svg
                    className="join-banner__trace"
                    viewBox="0 0 280 28"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path d={TRACE_PATH} />
                </svg>

                <p className="join-banner__body">
                    Global IEEE membership is separate from the student branch.
                    This form is how you join us at Nirma — workshops, technical
                    projects, and the events run by the team on this page.
                    <span className="join-banner__deadline">{deadlineLabel()}</span>
                </p>
            </div>

            <button className="join-banner__cta" onClick={openForm} type="button">
                Apply now
                <ArrowRight size={20} />
            </button>
        </section>
    )
}

export default JoinCampaignBanner
