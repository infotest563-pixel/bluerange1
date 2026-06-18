export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '65vh',
            width: '100%',
            backgroundColor: '#ffffff',
        }}>
            {/* Bluerange style loading dots */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
            }}>
                <span className="wdc-dot-1" style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#50c1ed',
                }} />
                <span className="wdc-dot-2" style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#50c1ed',
                }} />
                <span className="wdc-dot-3" style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#50c1ed',
                }} />
            </div>
            <div style={{
                marginTop: 24,
                color: '#50c1ed',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }}>
                Loading
            </div>
        </div>
    );
}
