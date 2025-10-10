import Layout from '@/components/layout'
import { isFeatureEnabled } from '@/public/lib/featureEvaluator'
import PageHeader from '@/components/pageHeader'
import MazeGameClient from './mazeGameClient'

export const metadata = {
    title: "Maze Game",
    description: "Play the interactive Maze Game at Old McDonald’s Pumpkin Patch. Scan hidden QR codes in the corn maze and enter to win prizes during the fall season."
}

export default function MazeGame() {

    if (isFeatureEnabled('maze_game_enabled') == false) return null

    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Maze Game</PageHeader>
            <MazeGameClient />
        </Layout>
    )
}
