%% Parameter Setup
Ksi = [0 1 0 -1  0 1 -1 -1  1;...
    0 0 1  0 -1 1  1 -1 -1]; % D2Q9 lattice
w = [4/9 1/9 1/9 1/9 1/9 1/36 1/36 1/36 1/36]; % Weight
c_s =1/sqrt(3); % Speed of Sound

Re = 100; % Raynold number
N_x = 50; % Number of nodes in the x-direction
N_y = 50; % Number of nodes in the x-direction
dx = 1; % Spacing in the x-direction
dy = 1; % Spacing in the y-direction
L = (N_x-1)*dx; % The domain size in x-direction

Mew = 0.1; % Kinematic viscosity
U_lid = Re*Mew/L; % Velocity of the moving lid
Tau = 3*Mew+0.5; % Relaxation Time
%% Initialization
Rho = ones(N_y,N_x); % Density matrix
u = ones(N_y,N_x); % x-component velocity matrix
v = ones(N_y,N_x); % y-component velocity matrix
f_old = ones(N_y,N_x,9); % Old PDF matrix
f_new = ones(N_y,N_x,9); % New PDF matrix
f_eq = ones(N_y,N_x,9); % Equilibrium PDF matrix

T_stop=100; %was 10000
for t=1:T_stop
    %% Solver
    %% Streaming for all interior nodes and also for boundary nodes (the applications of boundary conditions)
    for m=1:N_x
        for n=1:N_y
            if n==1 % This is the top boundary
                if m==1 % Top-left corner node
                    f_new(n,m,1)=f_old(n,m,1);
                    f_new(n,m,3)=f_old(n+1,m,3);
                    f_new(n,m,4)=f_old(n,m+1,4);
                    f_new(n,m,7)=f_old(n+1,m+1,7);

                    f_new(n,m,2)=f_new(n,m,4);
                    f_new(n,m,5)=f_new(n,m,3);
                    f_new(n,m,9)=f_new(n,m,7);

                    Rho_b=(Rho(n+1,m)+Rho(n,m+1))/2;
                    f_new(n,m,6)=(Rho_b-f_new(n,m,1)-f_new(n,m,2)-f_new(n,m,3)-f_new(n,m,4)-f_new(n,m,5)-f_new(n,m,7)-f_new(n,m,9))/2;
                    f_new(n,m,8)=f_new(n,m,6);
                elseif m==N_x % Top-right corner node
                    f_new(n,m,1)=f_old(n,m,1);
                    f_new(n,m,2)=f_old(n,m-1,2);
                    f_new(n,m,3)=f_old(n+1,m,3);
                    f_new(n,m,6)=f_old(n+1,m-1,6);

                    f_new(n,m,4)=f_new(n,m,2);
                    f_new(n,m,5)=f_new(n,m,3);
                    f_new(n,m,8)=f_new(n,m,6);

                    Rho_b=(Rho(n+1,m)+Rho(n,m-1))/2;
                    f_new(n,m,7)=(Rho_b-f_new(n,m,1)-f_new(n,m,2)-f_new(n,m,3)-f_new(n,m,4)-f_new(n,m,5)-f_new(n,m,6)-f_new(n,m,8))/2;
                    f_new(n,m,9)=f_new(n,m,7);
                else % All other nodes on the top boundary
                    f_new(n,m,1)=f_old(n,m,1);
                    f_new(n,m,2)=f_old(n,m-1,2);
                    f_new(n,m,3)=f_old(n+1,m,3);
                    f_new(n,m,4)=f_old(n,m+1,4);
                    f_new(n,m,6)=f_old(n+1,m-1,6);
                    f_new(n,m,7)=f_old(n+1,m+1,7);

                    f_new(n,m,5)=f_new(n,m,3);
                    Rho_b=f_new(n,m,1)+f_new(n,m,2)+f_new(n,m,4)+2*(f_new(n,m,3)+f_new(n,m,6)+f_new(n,m,7));
                    f_new(n,m,8)=f_new(n,m,6)+(f_new(n,m,2)-f_new(n,m,4))/2-Rho_b*U_lid/2;
                    f_new(n,m,9)=f_new(n,m,7)+(f_new(n,m,4)-f_new(n,m,2))/2+Rho_b*U_lid/2;
                end
            elseif n==N_y % This is the bottom boundary
                if m==1 % Bottom-left corner node
                    f_new(n,m,1)=f_old(n,m,1);
                    f_new(n,m,4)=f_old(n,m+1,4);
                    f_new(n,m,5)=f_old(n-1,m,5);
                    f_new(n,m,8)=f_old(n-1,m+1,8);


                    f_new(n,m,2)=f_new(n,m,4);
                    f_new(n,m,3)=f_new(n,m,5);
                    f_new(n,m,6)=f_new(n,m,8);
                    Rho_b=(Rho(n-1,m)+Rho(n,m+1))/2;
                    f_new(n,m,7)=(Rho_b-f_new(n,m,1)-f_new(n,m,2)-f_new(n,m,3)-f_new(n,m,4)-f_new(n,m,5)-f_new(n,m,6)-f_new(n,m,8))/2;
                    f_new(n,m,9)=f_new(n,m,7);
                elseif m==N_x % Botom-right corner node
                    f_new(n,m,1)=f_old(n,m,1);
                    f_new(n,m,2)=f_old(n,m-1,2);
                    f_new(n,m,5)=f_old(n-1,m,5);
                    f_new(n,m,9)=f_old(n-1,m-1,9);

                    f_new(n,m,4)=f_new(n,m,2);
                    f_new(n,m,3)=f_new(n,m,5);
                    f_new(n,m,7)=f_new(n,m,9);
                    Rho_b=(Rho(n-1,m)+Rho(n,m-1))/2;
                    f_new(n,m,6)=(Rho_b-f_new(n,m,1)-f_new(n,m,2)-f_new(n,m,3)-f_new(n,m,4)-f_new(n,m,5)-f_new(n,m,7)-f_new(n,m,9))/2;
                    f_new(n,m,8)=f_new(n,m,6);
                else % All other nodes on the bottom boundary
                    f_new(n,m,1)=f_old(n,m,1);
                    f_new(n,m,2)=f_old(n,m-1,2);
                    f_new(n,m,4)=f_old(n,m+1,4);
                    f_new(n,m,5)=f_old(n-1,m,5);
                    f_new(n,m,8)=f_old(n-1,m+1,8);
                    f_new(n,m,9)=f_old(n-1,m-1,9);

                    f_new(n,m,3)=f_new(n,m,5);
                    f_new(n,m,6)=f_new(n,m,8)+(f_new(n,m,4)-f_new(n,m,2))/2;
                    f_new(n,m,7)=f_new(n,m,9)+(f_new(n,m,2)-f_new(n,m,4))/2;
                end
            elseif m==1 % This is the left boundary
                f_new(n,m,1)=f_old(n,m,1);
                f_new(n,m,3)=f_old(n+1,m,3);
                f_new(n,m,4)=f_old(n,m+1,4);
                f_new(n,m,5)=f_old(n-1,m,5);
                f_new(n,m,7)=f_old(n+1,m+1,7);
                f_new(n,m,8)=f_old(n-1,m+1,8);

                f_new(n,m,2)=f_new(n,m,4);
                f_new(n,m,6)=f_new(n,m,8)+(f_new(n,m,5)-f_new(n,m,3))/2;
                f_new(n,m,9)=f_new(n,m,7)+(f_new(n,m,3)-f_new(n,m,5))/2;
            elseif m==N_x % This is the right boundary
                f_new(n,m,1)=f_old(n,m,1);
                f_new(n,m,2)=f_old(n,m-1,2);
                f_new(n,m,3)=f_old(n+1,m,3);
                f_new(n,m,5)=f_old(n-1,m,5);
                f_new(n,m,6)=f_old(n+1,m-1,6);
                f_new(n,m,9)=f_old(n-1,m-1,9);

                f_new(n,m,4)=f_new(n,m,2);
                f_new(n,m,7)=f_new(n,m,9)+(f_new(n,m,5)-f_new(n,m,3))/2;
                f_new(n,m,8)=f_new(n,m,6)+(f_new(n,m,3)-f_new(n,m,5))/2;
            else  % All the interior nodes
                f_new(n,m,1)=f_old(n,m,1);
                f_new(n,m,2)=f_old(n,m-1,2);
                f_new(n,m,3)=f_old(n+1,m,3);
                f_new(n,m,4)=f_old(n,m+1,4);
                f_new(n,m,5)=f_old(n-1,m,5);
                f_new(n,m,6)=f_old(n+1,m-1,6);
                f_new(n,m,7)=f_old(n+1,m+1,7);
                f_new(n,m,8)=f_old(n-1,m+1,8);
                f_new(n,m,9)=f_old(n-1,m-1,9);
            end
        end
    end
    %% Moment Calculation
    for m=1:N_x
        for n=1:N_y
            Rho(n,m)=sum(f_new(n,m,1:9));
            u(n,m)=(f_new(n,m,2)+f_new(n,m,6)+f_new(n,m,9)-f_new(n,m,4)-f_new(n,m,7)-f_new(n,m,8))/Rho(n,m);
            v(n,m)=(f_new(n,m,3)+f_new(n,m,6)+f_new(n,m,7)-f_new(n,m,5)-f_new(n,m,8)-f_new(n,m,9))/Rho(n,m);
        end
    end
    %% f_eq calculation
    for m=1:N_x
        for n=1:N_y
            for k=1:9
                f_eq(n,m,k)=w(k)*Rho(n,m)*(1+Ksi(:,k)'*[u(n,m);v(n,m)]/c_s^2+(Ksi(:,k)'*[u(n,m);v(n,m)])^2/(2*c_s^4)-(u(n,m)^2+v(n,m)^2)/(2*c_s^2));
            end
        end
    end
    %% Collision and Update
    f_old=f_new-(f_new-f_eq)/Tau;
end
%% Post-Processing
 % figure;
 % quiver(flipud(u),flipud(v),10)
 % axis equal tight
csvwrite('n_x_data.csv', N_x-1, 0, 0) % Write N_x to csv file, -1 because javascript starts at index 0 instead of index 1
                                      % Since N_x and N_y are the same, not going to bother writing N_y as well
writematrix(u,'u_data.csv') % Write u values to csv file
writematrix(v,'v_data.csv') % Write v values to csv file