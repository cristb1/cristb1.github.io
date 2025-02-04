const p5 = require(p5.js);

var Ksi = [0, 1, 0, -1, 0, 1, -1, -1,  1, 0, 0, 1, 0, -1, 1, 1, -1, -1]; // D2Q9 lattice
w = [4/9, 1/9, 1/9, 1/9, 1/9, 1/36, 1/36, 1/36, 1/36]; // Weight
c_s = 1/Math.sqrt(3); // Speed of Sound

Re = 100; // Raynold number
N_x = 50; // Number of nodes in the x-direction
N_y = 50; // Number of nodes in the x-direction
dx = 1; // Spacing in the x-direction
dy = 1; // Spacing in the y-direction
L = (N_x-1)*dx; // The domain size in x-direction

Mew = 0.1;
U_lid = Re*Mew/L;
Tau = 3*Mew+0.5;
Rho = Array.from({length: N_y}, () => Array(N_x).fill(1)); // Density matrix
u = Array.from({length: N_y}, () => Array(N_x).fill(1)); // x-component velocity matrix
v = Array.from({length: N_y}, () => Array(N_x).fill(1)); // y-component velocity matrix
f_old = Array.from({ length: 9 }, () => Array.from({ length: N_y }, () => Array(N_x).fill(1))); // Old PDF matrix
f_new = Array.from({ length: 9 }, () => Array.from({ length: N_y }, () => Array(N_x).fill(1))); // New PDF matrix
f_eq = Array.from({ length: 9 }, () => Array.from({ length: N_y }, () => Array(N_x).fill(1))); // Equilibrium PDF matrix

T_stop = 1;
for(let t = 1; t < T_stop; t++){
    for(let m = 0; m < N_x; m++){
        for(let n = 0; n < N_y; n++){
            if(n==0){
                if(m==0){
                    f_new[n][m][0]=f_old[n][m][0];
                    f_new[n][m][2]=f_old[n+1][m][2];
                    f_new[n][m][3]=f_old[n][m+1][3];
                    f_new[n][m][6]=f_old[n+1][m+1][6];

                    f_new[n][m][1] = f_new[n][m][3];
                    f_new[n][m][4]=f_new[n][m][2];
                    f_new[n][m][8]=f_new[n][m][6];

                    Rho_b=(Rho[n+1][m]+Rho[n][m+1])/2;
                    f_new[n][m][5]=(Rho_b-f_new[n][m][0]-f_new[n][m][1]-f_new[n][m][2]-f_new[n][m][3]-f_new[n][m][4]-f_new[n][m][6]-f_new[n][m][8])/2;
                    f_new[n][m][7]=f_new[n][m][5];
                }
                else if(m==N_x){
                    f_new[n][m][0]=f_old[n][m][0];
                    f_new[n][m][1]=f_old[n][m-1][1];
                    f_new[n][m][2]=f_old[n+1][m][2];
                    f_new[n][m][5]=f_old[n+1][m-1][5];

                    f_new[n][m][3]=f_new[n][m][1];
                    f_new[n][m][4]=f_new[n][m][2];
                    f_new[n][m][7]=f_new[n][m][5];

                    Rho_b=(Rho[n+1][m]+Rho[n][m-1])/2;
                    f_new[n][m][6]=(Rho_b-f_new[n][m][0]-f_new[n][m][1]-f_new[n][m][2]-f_new[n][m][3]-f_new[n][m][4]-f_new[n][m][5]-f_new[n][m][7])/2;
                    f_new[n][m][8]=f_new[n][m][6]; //58 
                }else{
                    f_new[n][m][0]=f_old[n][m][0];
                    f_new[n][m][1]=f_old[n][m-1][1];
                    f_new[n][m][2]=f_old[n+1][m][2];
                    f_new[n][m][3]=f_old[n][m+1][3];
                    f_new[n][m][5]=f_old[n+1][m-1][5];
                    f_new[n][m][6]=f_old[n+1][m+1][6];

                    f_new[n][m][4]=f_new[n][m][2];
                    Rho_b=f_new[n][m][0]+f_new[n][m][1]+f_new[n][m][3]+2*(f_new[n][m][2]+f_new[n][m][5]+f_new[n][m][6]);
                    f_new[n][m][7]=f_new[n][m][5]+(f_new[n][m][1]-f_new[n][m][3])/2-Rho_b*U_lid/2;
                    f_new[n][m][8]=f_new[n][m][6]+(f_new[n][m][3]-f_new[n][m][1])/2+Rho_b*U_lid/2; //70
                }    
            }else if(n==N_y){
                if(m==0){
                    f_new[n][m][0]=f_old[n][m][0];
                    f_new[n][m][3]=f_old[n][m+1][3];
                    f_new[n][m][4]=f_old[n-1][m][4];
                    f_new[n][m][7]=f_old[n-1][m+1][7];


                    f_new[n][m][1]=f_new[n][m][3];
                    f_new[n][m][2]=f_new[n][m][4];
                    f_new[n][m][5]=f_new[n][m][7];
                    Rho_b=(Rho[n-1][m]+Rho[n][m+1])/2;
                    f_new[n][m][6]=(Rho_b-f_new[n][m][0]-f_new[n][m][1]-f_new[n][m][2]-f_new[n][m][3]-f_new[n][m][4]-f_new[n][m][5]-f_new[n][m][7])/2;
                    f_new[n][m][8]=f_new[n][m][6];
                }else if(m==N_x){
                    f_new[n][m][0]=f_old[n][m][0];
                    f_new[n][m][1]=f_old[n][m-1][1];
                    f_new[n][m][4]=f_old[n-1][m][4];
                    f_new[n][m][8]=f_old[n-1][m-1][8];

                    f_new[n][m][3]=f_new[n][m][1];
                    f_new[n][m][2]=f_new[n][m][4];
                    f_new[n][m][6]=f_new[n][m][8];
                    Rho_b=(Rho[n-1][m]+Rho[n][m-1])/2;
                    f_new[n][m][5]=(Rho_b-f_new[n][m][0]-f_new[n][m][1]-f_new[n][m][2]-f_new[n][m][3]-f_new[n][m][4]-f_new[n][m][6]-f_new[n][m][8])/2;
                    f_new[n][m][7]=f_new[n][m][5]; //97
                }else{
                    f_new[n][m][0]=f_old[n][m][0];
                    f_new[n][m][1]=f_old[n][m-1][1];
                    f_new[n][m][3]=f_old[n][m+1][3];
                    f_new[n][m][4]=f_old[n-1][m][4];
                    f_new[n][m][7]=f_old[n-1][m+1][7];
                    f_new[n][m][8]=f_old[n-1][m-1][8];

                    f_new[n][m][2]=f_new[n][m][4];
                    f_new[n][m][5]=f_new[n][m][7]+(f_new[n][m][3]-f_new[n][m][1])/2;
                    f_new[n][m][6]=f_new[n][m][8]+(f_new[n][m][1]-f_new[n][m][3])/2;
                }
            }else if(m==0){
                f_new[n][m][0]=f_old[n][m][0];
                f_new[n][m][2]=f_old[n+1][m][2];
                f_new[n][m][3]=f_old[n][m+1][3];
                f_new[n][m][4]=f_old[n-1][m][4];
                f_new[n][m][6]=f_old[n+1][m+1][6];
                f_new[n][m][7]=f_old[n-1][m+1][7];

                f_new[n][m][1]=f_new[n][m][3];
                f_new[n][m][5]=f_new[n][m][7]+(f_new[n][m][4]-f_new[n][m][2])/2;
                f_new[n][m][8]=f_new[n][m][6]+(f_new[n][m][2]-f_new[n][m][4])/2; //120
            }else if(m==N_x){
                f_new[n][m][0]=f_old[n][m][0];
                f_new[n][m][1]=f_old[n][m-1][1];
                f_new[n][m][2]=f_old[n+1][m][2];
                f_new[n][m][4]=f_old[n-1][m][4];
                f_new[n][m][5]=f_old[n+1][m-1][5];
                f_new[n][m][8]=f_old[n-1][m-1][8]; 

                f_new[n][m][3]=f_new[n][m][1];
                f_new[n][m][6]=f_new[n][m][8]+(f_new[n][m][4]-f_new[n][m][2])/2;
                f_new[n][m][7]=f_new[n][m][5]+(f_new[n][m][2]-f_new[n][m][4])/2;
            }else{
                f_new[n][m][0]=f_old[n][m][0];
                f_new[n][m][1]=f_old[n][m-1][1];
                f_new[n][m][2]=f_old[n+1][m][2];
                f_new[n][m][3]=f_old[n][m+1][3];
                f_new[n][m][4]=f_old[n-1][m][4];
                f_new[n][m][5]=f_old[n+1][m-1][5];
                f_new[n][m][6]=f_old[n+1][m+1][6];
                f_new[n][m][7]=f_old[n-1][m+1][7];
                f_new[n][m][8]=f_old[n-1][m-1][8];
            }
        }
    } //144

    for(let m = 0; m < N_x; m++){
        for(let n = 0; n < N_y; n++){
            for(let k = 0; k < 9; k++){
                f_eq[n][m][k] = w[k] * Rho[n][m] * (1 + Ksi.map(row => row[k]).reduce((sum,val,index) => sum + val * [u[n][m], v[n][m]][index], 0) / c_s**2 + Math.pow(Ksi.map(row => row[k]).reduce((sum,val,index) => sum + val * [u[n][m], v[n][m]][index], 0), 2) / (2 * Math.pow(c_s, 4)) - (Math.pow(u[n][m], 2) + Math.pow(v[n][m], 2)) / (2 * Math.pow(c_s, 2)));
            }
        }
    }
    f_old = f_new - (f_new - f_eq)/Tau;

}


const flippedU = u.reverse();
const flippedV = v.reverse();

const scale = 10;

// Assuming you are using a library like p5.js for visualization
function setup() {
    createCanvas(400, 400); // Set canvas size
    background(255);
    stroke(0);
    for (let i = 0; i < N_y; i++) {
        for (let j = 0; j < N_x; j++) {
            line(j * scale, i * scale, j * scale + flippedU[i][j] * scale, i * scale + flippedV[i][j] * scale);
        }
    }
}

function draw() {
    // No continuous drawing needed
    noLoop();
}

 