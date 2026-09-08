import Layout from '@/components/layout'
import PageHeader from '@/components/pageHeader'
import MazeGameClient from './mazeGameClient'
import { getFlagEvaluator, getFlags } from '@/app/flags.server'

export const metadata = {
    title: "250 Years Maze Game",
    description: "Explore 250 years of American independence in Old McDonald’s corn maze. Find four historical QR-code stations, complete the phrase, and enter the drawing."
}

export default async function MazeGame() {
    const flags = await getFlags();
    const isFeatureEnabled = getFlagEvaluator(flags);
    if (!isFeatureEnabled('maze_game_enabled')) return null

    return (
        <Layout>
            <PageHeader subtitle="2026 Season">250 Years Maze Game</PageHeader>
            <MazeGameClient />
        </Layout>
    )
}
