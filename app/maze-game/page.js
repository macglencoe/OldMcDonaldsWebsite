import Layout from '@/components/layout'
import PageHeader from '@/components/pageHeader'
import MazeGameClient from './mazeGameClient'
import { getFlagEvaluator, getFlags } from '@/app/flags.server'

export const metadata = {
    title: "Maze Game",
    description: "Play the interactive Maze Game at Old McDonald’s Pumpkin Patch. Scan hidden QR codes in the corn maze and enter to win prizes during the fall season."
}

export default async function MazeGame() {
    const flags = await getFlags();
    const isFeatureEnabled = getFlagEvaluator(flags);
    if (!isFeatureEnabled('maze_game_enabled')) return null

    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Maze Game</PageHeader>
            <MazeGameClient />
        </Layout>
    )
}
