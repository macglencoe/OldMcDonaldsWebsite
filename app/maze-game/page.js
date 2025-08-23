import Layout from '@/components/layout'
import { isFeatureEnabled } from '@/public/lib/featureEvaluator'
import PageHeader from '@/components/pageHeader'
import MazeGameClient from './mazeGameClient'

export const metadata = {
    title: "Maze Game"
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
