import React from "react";
import {Box, Container, Grid, Stack, Typography} from "@mui/material";
import {BoxFeatures, CubeState, LockState, UtilizationBar, BoxNumber, BoxTypes, MaintenanceStatus} from "../../src";

export function CubeDemo() {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>Cube Demo</Typography>

            <Box sx={{ mb: 4}}>
                <Typography>Collection of cube components.</Typography>
            </Box>

            <Typography variant="h2" gutterBottom>Cube States</Typography>
            <Stack spacing={1} direction="row" sx={{ mb: 4}}>
                <Typography gutterBottom>Display the current cube connection status.</Typography>
                <CubeState connected />
                <CubeState connected={false} />
            </Stack>

            <Typography variant="h2" gutterBottom>Utilization Bar</Typography>
            <Stack spacing={1} direction="row" sx={{ mb: 4}}>
                <UtilizationBar
                    occupied={15}
                    available={32}
                    disabled={8}
                    total={55}
                    occupiedLabel="Stored"
                    availableLabel="Free"
                    disabledLabel="Dirty"
                    totalLabel="Boxes"
                />
            </Stack>

            <Typography variant="h2" gutterBottom>Lock States</Typography>
            <Typography gutterBottom>Display the current lock status.</Typography>
            <Stack spacing={1} direction="row" sx={{ mb: 2}}>
                <LockState status="Open" />
                <LockState status="Closed" />
                <LockState status="Blocked" />
                <LockState status="Breakin" />
            </Stack>
            <Typography gutterBottom>Minimized</Typography>
            <Stack spacing={1} direction="row" sx={{ mb: 4}}>
                <LockState status="Open" minimized />
                <LockState status="Closed" minimized />
                <LockState status="Blocked" minimized />
                <LockState status="Breakin" minimized />
            </Stack>

            <Typography variant="h2" gutterBottom>Box Features</Typography>
            <Typography gutterBottom>Display the enabled features of the box.</Typography>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 2}}>
                <Typography variant="body2">Box 1</Typography>
                <BoxFeatures
                    cooled
                    accessible
                    dangerousGoods={false}
                    charger={false}
                />
            </Stack>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 2}}>
                <Typography variant="body2">Box 2</Typography>
                <BoxFeatures
                    cooled={false}
                    accessible={false}
                    dangerousGoods
                    charger={false}
                />
            </Stack>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 2}}>
                <Typography variant="body2">Box 3</Typography>
                <BoxFeatures
                    cooled={false}
                    accessible={false}
                    dangerousGoods={false}
                    charger
                />
            </Stack>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 4}}>
                <Typography variant="body2">Box 4</Typography>
                <BoxFeatures
                    cooled={false}
                    accessible={false}
                    dangerousGoods={false}
                    charger={false}
                    renderEmpty
                />
            </Stack>
            <Typography gutterBottom>Minimized</Typography>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 4}}>
                <Typography variant="body2">Box</Typography>
                <BoxFeatures
                    cooled
                    accessible
                    dangerousGoods
                    charger
                    minimized
                />
            </Stack>
            <Typography variant="h2" gutterBottom>Box Numbers</Typography>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 4}}>
                <Typography variant="body2">Avatar</Typography>
                <BoxNumber number={0} />
                <BoxNumber number={1} />
                <BoxNumber number={2} />
                <BoxNumber number={3} />

            </Stack>
            <Typography variant="h2" gutterBottom>Box Types</Typography>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 4}}>
                <Typography variant="body2">Chips</Typography>
                <BoxTypes boxTypes={["Type1", "Type2"]} />
            </Stack>
            <Typography variant="h2" gutterBottom>Maintenance Status</Typography>
            <Stack spacing={1} direction="row" alignItems='center' sx={{ mb: 4}}>
                <Typography variant="body2">Chip</Typography>
                <MaintenanceStatus status="Maintenance" />
            </Stack>
        </Container>
    )
}